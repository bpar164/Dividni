import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class MultipleChoice extends Document {
    @Prop()
    question: object;

    @Prop()
    xml: string;
}

export const MCSchema = SchemaFactory.createForClass(MultipleChoice);