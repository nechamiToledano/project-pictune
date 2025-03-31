# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 5000


# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["PicTune.API/PicTune.API.csproj", "PicTune.API/"]
COPY ["PicTune.Data/PicTune.Data.csproj", "PicTune.Data/"]
COPY ["PicTune.Core/PicTune.Core.csproj", "PicTune.Core/"]
COPY ["PicTune.Service/PicTune.Service.csproj", "PicTune.Service/"]
RUN dotnet restore "./PicTune.API/PicTune.API.csproj"
COPY . .
WORKDIR "/src/PicTune.API"
RUN dotnet build "./PicTune.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./PicTune.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app

# Copy the solution and project files
COPY *.sln ./
COPY pictune-server/PicTune.API/*.csproj /app/PicTune.API/
COPY pictune-server/PicTune.Core/*.csproj /app/PicTune.Core/
COPY pictune-server/PicTune.Data/*.csproj /app/PicTune.Data/
COPY pictune-server/PicTune.Service/*.csproj /app/PicTune.Service/


# Restore dependencies
RUN dotnet restore

# Copy the rest of the project files and build
COPY . ./
WORKDIR /app/PicTune.API
RUN dotnet publish -c Release -o out

# Use the official .NET runtime image for running the project
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://+:5000
CMD ["dotnet", "PicTune.API.dll"]
ENTRYPOINT ["dotnet", "PicTune.API.dll"]
