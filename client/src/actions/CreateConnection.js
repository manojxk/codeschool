import Axios from "axios";

async function createConnection(tutorID, userID, history) {
  try {
    //Check if conversation already exists
    const conversationRes = await Axios.post("/messages/findExisting", {
      tutorID: tutorID,
      userID: userID,
    });

    if (conversationRes.data === false) {
      //Create new Connection and Conversation
      const connectionRes = await Axios.post("/messages/newConnection", {
        tutorId: tutorID,
        currentUserId: userID,
      });
      history.push(`/app/messages/${connectionRes.data}`);
    } else {
      history.push(`/app/messages/${conversationRes.data}`);
    }
  } catch (err) {
    console.log(err);
  }
}

export default createConnection;
