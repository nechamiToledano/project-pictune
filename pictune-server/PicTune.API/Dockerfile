# שלב בסיס להרצת האפליקציה
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

# שלב לבניית הפרויקט עם גרסת SDK מדויקת
FROM mcr.microsoft.com/dotnet/sdk:8.0.410 AS build
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

# שלב פרסום
FROM build AS publish
RUN dotnet publish "./PicTune.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# שלב הרצה סופי
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "PicTune.API.dll"]
