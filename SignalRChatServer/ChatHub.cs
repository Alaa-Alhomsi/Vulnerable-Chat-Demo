using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SignalRChatServer.Data;

namespace SignalRChatServer
{
    public class ChatHub : Hub//<IChatClient> //typesafe Hub
    {
        public async Task SendMessage(string user, string message, IDbContextFactory<ApplicationDbContext> _contextFactory)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message, DateTime.UtcNow.ToString("O"));

            using(var _context = await _contextFactory.CreateDbContextAsync())
            {
                await _context.Messages.AddAsync(new() { Sender = user, Text = message, SentAt = DateTime.UtcNow });
                await _context.SaveChangesAsync();
            }
                
            
            //typesafe Hub
            //await Clients.All.ReceiveMessage(user, message);
        }
    }
    //typesafe Hub
    public interface IChatClient
    {
        //Task ReceiveMessage(string user, string message);
    }
}
