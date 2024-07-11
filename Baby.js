const axios = require('axios');

const baseApiUrl = async () => {
  try {
    const response = await axios.get('https://raw.githubusercontent.com/Nobita010/RIAD/main/baseApiUrl.json');
    return response.data.api;
  } catch (error) {
    console.error('Error fetching base API URL:', error);
    return null;
  }
};

module.exports = {
  config: {
    name: "baby",
    aliases: ["baby", "bbe", "babe" ],
    version: "6.9.0",
    author: "riad",
    countDown: 0,
    role: 0,
    description: "better then all sim simi",
    category: "chat",
    guide: {
      en: "{pn}[anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NeeMessage]"
    }
  },
  onStart: async ({ api, event, args, usersData }) => {
    const baseUrl = await baseApiUrl();
    if (!baseUrl) {
      return api.sendMessage("Unable to fetch base API URL. Please try again later.", event.threadID, event.messageID);
    }
    const link = `${baseUrl}/baby`;
    const riad = args.join(" ").toLowerCase();
    const uid = event.senderID;
    let command;
    let comd;
    let final;
    try {
      if (!args[0]) {
        const ran = ["Bolo baby", "hum", "type help baby", "type !baby hi"];
        const r = ran[Math.floor(Math.random() * ran.length)];
        return api.sendMessage(r, event.threadID, event.messageID);
      }
      //-------------------------------------//
      else if (args[0] === 'remove') {
        const fina = riad.replace("remove ", "");
        const respons = await axios.get(`${link}?remove=${fina}`);
        const dat = respons.data.message;
        api.sendMessage(`${dat}`, event.threadID, event.messageID);
      }
      //------------------------------------//
      else if (args[0] === 'rm' && riad.includes('-')) {
        const fina = riad.replace("rm ", "");
        const fi = fina.split(' - ')[0];
        const f = fina.split(' - ')[1];
        const respons = await axios.get(`${link}?remove=${fi}&index=${f}`);
        const da = respons.data.message;
        api.sendMessage(`${da}`, event.threadID, event.messageID);
      }
      //-----------------------------------//
      else if (args[0] === 'list') {
        if (args[1] === 'all') {
          const res = await axios.get(`${link}?list=all`);
          const data = res.data;
          Promise.all(data.teacher.teacherList.map(async (item) => {
            const number = Object.keys(item)[0];
            const value = item[number];
            const userData = await usersData.get(number);
            const name = userData.name;
            return { name, value };
          })).then(teachers => {
            teachers.sort((a, b) => b.value - a.value);
            const output = teachers.map((teacher, index) => `${index + 1}/ ${teacher.name}: ${teacher.value}`).join('\n');
            api.sendMessage(`Total Teach = ${data.length}\n\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
          }).catch(error => {
            console.error(error);
            api.sendMessage(`Error fetching teacher data`, event.threadID, event.messageID);
          });
        } else {
          const respo = await axios.get(`${link}?list=all`);
          const d = respo.data.length;
          api.sendMessage(`Total Teach = ${d}`, event.threadID, event.messageID);
        }
      }
      //-----------------------------------//
      else if (args[0] === 'msg' || args[0] === 'message') {
        const fuk = riad.replace("msg ", "");
        const respo = await axios.get(`${link}?list=${fuk}`);
        const d = respo.data.data;
        api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
      }
      //----------------------------------//
      else if (args[0] === 'edit') {
        const command = riad.split(' - ')[1];
        if (command.length < 2) {
          return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
        }
        const res = await axios.get(`${link}?edit=${args[1]}&replace=${command}`);
        const dA = res.data.message;
        api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);
      }
      //-------------------------------------//

      else if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
        command = riad.split(' - ')[1];
        comd = riad.split(' - ')[0];
        final = comd.replace("teach ", "");
        if (command.length < 2) {
          return api.sendMessage('❌ | Invalid format! Use [YourMessage] - [Reply1], [Reply2], [Reply3]... OR remove [YourMessage] OR list OR edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
        }
        const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}`);
        const tex = re.data.message;
        const name = re.data.teacher;
        const data = await usersData.get(name);
        const teacher = data.name;
        const teachs = re.data.teachs;
        api.sendMessage(`✅ Replies added ${tex}\nTeacher: ${teacher}\nTeachs: ${teachs}`, event.threadID, event.messageID);
      }
      //------------------------------------//
      else if (args[0] === 'teach' && args[1] === 'amar') {
        command = riad.split(' - ')[1];
        comd = riad.split(' - ')[0];
        final = comd.replace("teach ", "");
        if (command.length < 2) {
          return api.sendMessage('❌ | Invalid format! Use [YourMessage] - [Reply1], [Reply2], [Reply3]... OR remove [YourMessage] OR list OR edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
        }
        const re = await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`);
        const tex = re.data.message;
        api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
      }
      //------------------------------------//
      else if (args[0] === 'teach' && args[1] === 'react') {
        command = riad.split(' - ')[1];
        comd = riad.split(' - ')[0];
        final = comd.replace("teach react ", "");
        if (command.length < 2) {
          return api.sendMessage('❌ | Invalid format! Use [teach] [YourMessage] - [Reply1], [Reply2], [Reply3]... OR [teach] [react] [YourMessage] - [react1], [react2], [react3]... OR remove [YourMessage] OR list OR edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
        }
        const re = await axios.get(`${link}?teach=${final}&react=${command}`);
        const tex = re.data.message;
        api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
      }
      //------------------------------------//
      else if (riad.includes('amar name ki') || riad.includes('amr nam ki') || riad.includes('amar nam ki') || riad.includes('amr name ki')) {
        const response = await axios.get(`${link}?text=amar name ki&senderID=${uid}`);
        const data = response.data.reply;
        api.sendMessage(`${data}`, event.threadID, event.messageID);
      }
      //----------------------------------//
      else {
        const response = await axios.get(`${link}?text=${riad}`);
        const data = response.data.reply;
        api.sendMessage(`${data}`, event.threadID, event.messageID);
      }
    } catch (e) {
      console.log(e);
      api.sendMessage("Check console for error ", event.threadID, event.messageID);
    }
  }
};
