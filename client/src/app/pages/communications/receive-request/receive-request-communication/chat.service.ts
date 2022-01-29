import { Injectable } from '@angular/core';

import { messages } from './messages';
import { botReplies, gifsLinks, imageLinks } from './bot-replies';

@Injectable()
export class ChatService {

  // getCommReq() {
  //   this.communicationsService
  //   .getCommunReceivedRequests(this.customerProfileService.currentCustomerProfile.customerProfileId)
  //   .then(requests => (this.bindReceivedRequestInfo(requests)), err => (this.showRequestInfoError(err)));
  // }
  loadMessages(requests) {
    console.log("Load Messages Called");
    var message_array = [];
    var temp_message = requests.MyClientComm;
    var message;
      for(var i=temp_message.length-1; i>=0; i--){
        var temp_date = new Date();
        var createddate = temp_message[i].CreatedDate.split(" ")[0];
        var createdtime = temp_message[i].CreatedDate.split(" ")[1];
        var createdtime_temp = createdtime.split(":");
        ///var createddate_array = createddate.split('.');
        var createddate_array = createddate.match(/.{1,4}/g);
        var createddate_array2 = createddate_array[1].match(/.{1,2}/g);
        temp_date.setFullYear(createddate_array[0], +createddate_array2[0] - 1, createddate_array2[1]);
        // temp_date.setUTCHours(23);
        // temp_date.setUTCMinutes(23);
        // temp_date.setUTCSeconds(23);
        temp_date.setHours(createdtime_temp[0]);
        temp_date.setMinutes(createdtime_temp[1]);
        temp_date.setSeconds(createdtime_temp[2]);
        // temp_date.setUTCHours(10);
        // temp_date.setMinutes(55);
        // temp_date.setSeconds(55);
        console.log("date = " + temp_date);

       if(temp_message[i].IsVisible === "0000000000"){
        message = {
          text: temp_message[i].CommentText,
          reply: false,
          date: temp_date,
          user: {
            name: 'SIDF',
            avatar: 'https://i.gifer.com/no.gif',
            }
          };
       } else {
          message = {
            text: temp_message[i].CommentText,
            reply: true,
            date: temp_date,
            user: {
              name: temp_message[i].UserId,
              avatar: 'https://i.gifer.coms/no.gif',
              }
            };
          }
          if(message_array.length===0){
            message_array.push(message);
          } else{
          message_array.push(message);
          }
    }
    console.log(message_array);
    console.log(messages);
    return message_array;
  }

  loadBotReplies() {
    return botReplies;
  }

  reply(message: string) {
    const botReply: any =  this.loadBotReplies()
      .find((reply: any) => message.search(reply.regExp) !== -1);

    if (botReply.reply.type === 'quote') {
      botReply.reply.quote = message;
    }

    if (botReply.type === 'gif') {
      botReply.reply.files[0].url = gifsLinks[Math.floor(Math.random() * gifsLinks.length)];
    }

    if (botReply.type === 'pic') {
      botReply.reply.files[0].url = imageLinks[Math.floor(Math.random() * imageLinks.length)];
    }

    if (botReply.type === 'group') {
      botReply.reply.files[1].url = gifsLinks[Math.floor(Math.random() * gifsLinks.length)];
      botReply.reply.files[2].url = imageLinks[Math.floor(Math.random() * imageLinks.length)];
    }

    botReply.reply.text = botReply.answerArray[Math.floor(Math.random() * botReply.answerArray.length)];
    return { ...botReply.reply };
  }
}
