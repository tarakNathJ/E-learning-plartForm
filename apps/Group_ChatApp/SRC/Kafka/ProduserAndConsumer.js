
import { Kafka } from 'kafkajs';
import { message as messageModule}  from '../Modules/Message.module.js'

const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [`${process.env.KAFKA_BROKER_URL}`]
})




let produser = null;
function CreatePreduser  (){
    if(produser)  return produser ;
    const newProduser = kafka.producer();
    newProduser.connect();
    produser = newProduser;
    return produser;
}

export async function produseMessage (message){
    const producer  = await CreatePreduser();
    await producer.send({
        message: [{key :`messages :- ${Date.now()}` , value:message}],
        topic: "MESSAGES",
    })

    return true;
}

export async function ConsumeMessages () {
    const consumer  = kafka.consumer({groupId:"defalt"});
    await consumer.connect();
    consumer.subscribe({topic:"MESSAGES"});
    await consumer.run({
        autoCommit:true,
        eachMessage: async ({message ,pause }) => {
            if (!message.value) return;
            try{
                const {roomId, userId, userName,groupId,message} = JSON.parse(message.value.toString());
                await messageModule.create({
                    userID:userId,
                    groupID:groupId,
                    message:message,
                    userName:userName
                })

            }catch(error){
                // any resion database down then pause messges
                pause();
                setTimeout(() =>{
                    consumer.resume([{topic:"MESSAGES"}])

                }, 120*1000)
            }

            },
    });

}