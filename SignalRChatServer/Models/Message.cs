namespace SignalRChatServer.Models
{
    public class Message
    {
        public int Id { get; set; }
        public string Sender { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
    }
}
