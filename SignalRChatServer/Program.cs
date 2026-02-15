
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using SignalRChatServer.Data;

namespace SignalRChatServer;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddSignalR();

        builder.Services.AddDbContextFactory<ApplicationDbContext>(options => 
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy.WithOrigins("http://127.0.0.1:5500") // Nur die HTML-Client-Origin erlauben
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials(); // Für Browser mit Authentifizierung
            });
        });

        var app = builder.Build();

        app.MapDelete("/messages", async (IDbContextFactory<ApplicationDbContext> _contextFactory) =>
        {
            using (var _context  = await _contextFactory.CreateDbContextAsync())
            {
                _context.Database.ExecuteSqlRaw("DELETE FROM Messages");
                return Results.NoContent();
            }
        });
        app.MapGet("/messages", async (IDbContextFactory<ApplicationDbContext> _contextFactory) =>
        {
            using (var _context = await _contextFactory.CreateDbContextAsync())
            {
                return Results.Ok(
                    await _context.Messages.ToListAsync()
                    );
            }
        });

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseRouting();
        app.MapHub<ChatHub>("/chatHub");
        app.UseStaticFiles();
        app.UseAuthorization();

        app.UseCors();
        app.MapControllers();

        app.Run();
    }
}
