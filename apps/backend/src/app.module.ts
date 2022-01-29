import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ClientModule } from "./client/client.module";

@Module({
  imports: [
    ClientModule,
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: "schema.gql",
    }),
  ],
})
export class AppModule {}
