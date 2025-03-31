
namespace TagLib
{
    internal class StreamFileAbstraction : File.IFileAbstraction
    {
        public string Name { get; }
        public Stream ReadStream { get; }
        public Stream WriteStream { get; }

        public StreamFileAbstraction(string name, Stream readStream, Stream writeStream)
        {
            Name = name;
            ReadStream = readStream;
            WriteStream = writeStream;
        }

        public void CloseStream(Stream stream)
        {
            stream.Close();
        }
    }
}