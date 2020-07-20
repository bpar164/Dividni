import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
    @Prop()
    userID: string;

    @Prop()
    userEmail: string;  
}

export const UserSchema = SchemaFactory.createForClass(User);