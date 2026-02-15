using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SignalRChatServer.Models;

namespace SignalRChatServer.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }
        public DbSet<Message> Messages { get; set; }
    }
}
