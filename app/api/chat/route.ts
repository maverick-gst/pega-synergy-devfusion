import { NextResponse } from 'next/server';
import { app } from '@/lib/graph/graph';
import { MongoDBSaver } from '@langchain/langgraph-checkpoint-mongodb';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    console.log('Request received');
      const { message, productId } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const config = {
        configurable: {
          thread_id: uuidv4(),
      }
    };

    const stream = await app.stream({
      messages: [
        {
          role: "user",
          content: message,
        }
      ],
    }, config);

    //for old workflows to resume
    // Update the state to pass the dynamic breakpoint
    //await app.updateState(config, { input: "foo" });
    //for await (const event of await app.stream(null, config)) {
    //   console.log(event);
    // }

    let finalResult = null;
    for await (const value of stream) {
      console.log("---STEP---");
      console.log(value);
      console.log("---END STEP---");
      finalResult = value;
    }

    console.log("finalResult:", finalResult);
    

    const checkpointer_output = finalResult ? 
      [...Object.values(finalResult)].reverse()[0] : 
      null;

    console.log("checkpointer_output:", checkpointer_output);
    return NextResponse.json(checkpointer_output);
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


export async function GET(request: Request) {
  try {
    
    const { thread_id } = await request.json();
    const config = {
      configurable: {
        thread_id: thread_id || "default_thread_id",
      }
    };
    const state = await app.getState(thread_id);
    // list checkpoints
    const client = new MongoClient(process.env.MONGO_URL as string);
    const checkpointer = new MongoDBSaver({ client });  
    const checkpoints = [];
    for await (const checkpoint of checkpointer.list(config)) {
      checkpoints.push(checkpoint);
    }
    return NextResponse.json({ state: state, checkpoints: checkpoints });
  } catch (error) {
    console.error('Error in get state API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
