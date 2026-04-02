import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";


@WebSocketGateway({
    cors: {origin: 'http://localhost:3000'},
})

export class ProjectGateway{
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('joinProject')
    handleJoinProject(client: Socket, projectId: string){
        client.join(projectId);
        console.log(`User ${client.id} joined project: ${projectId}`)
    }

    @SubscribeMessage('leaveProject')
    handleLeaveProject(client: Socket, projectId: string){
        client.leave(projectId);
        console.log(`User ${client.id} leave project: ${projectId}`)
    }

    notifyTaskUpdate(projectId: string, data: any){
        this.server.to(projectId).emit('taskUpdate', data);
    }
}