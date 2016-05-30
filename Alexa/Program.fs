open System
open Amazon.SQS
open Amazon.SQS.Internal
open Amazon.SQS.Model
open Amazon.SQS.Util

// Amazon.Util.ProfileManager.RegisterProfile("default", "AKIAIZ6HIGSOMTUTIKZQ", "vUG4KkVI8650/nECAGuXasFVfsLcEJOyaCpxvZoQ")
let amazonSQSConfig = new AmazonSQSConfig();
amazonSQSConfig.ServiceURL <- "http://sqs.us-east-1.amazonaws.com"
let client = new AmazonSQSClient(amazonSQSConfig)

let url = "https://sqs.us-east-1.amazonaws.com/660181231855/Psi"

while true do
    // Receiving a message
    let receiveMessageRequest = new ReceiveMessageRequest()
    receiveMessageRequest.QueueUrl <- url
    receiveMessageRequest.MaxNumberOfMessages <- 10
    receiveMessageRequest.WaitTimeSeconds <- 10
    let receiveMessageResponse = client.ReceiveMessage(receiveMessageRequest)
    // Console.WriteLine("Printing received message.\n");
    for message in receiveMessageResponse.Messages do
        // Console.WriteLine(" Message");
        // Console.WriteLine(" MessageId: {0}", message.MessageId);
        // Console.WriteLine(" ReceiptHandle: {0}", message.ReceiptHandle);
        // Console.WriteLine(" MD5OfBody: {0}", message.MD5OfBody);
        Console.WriteLine("Psi heard: '{0}'", message.Body);
        // for entry in message.Attributes do
        //     Console.WriteLine(" Attribute");
        //     Console.WriteLine(" Name: {0}", entry.Key);
        //     Console.WriteLine(" Value: {0}", entry.Value);
        let resp = client.DeleteMessage(new DeleteMessageRequest(url, message.ReceiptHandle))
        // printfn "Delete: %A" resp
        ()

// let messageRecieptHandle = receiveMessageResponse.Messages.[0].ReceiptHandle;

Console.ReadLine() |> ignore