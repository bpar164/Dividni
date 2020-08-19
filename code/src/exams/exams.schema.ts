import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Exams extends Document {
    @Prop()
    exam: object;

    @Prop()
    userID: string;
}

export const ExamsSchema = SchemaFactory.createForClass(Exams);