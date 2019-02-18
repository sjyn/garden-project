function formatMessageDate(message) {
  return `[${getNiceDate()}]: ${message}`;
}

function getNiceDate() {
  const now = new Date();
  const monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "June", "July",
    "Aug", "Sep", "Oct",
    "Nov", "Dec",
  ];
  return `${monthNames[now.getMonth()]} ${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;
}

function stripMessageDate(messageWithDate) {
  return messageWithDate.replace(/\[.*\]:/, '').trim();
}

module.exports.getNiceDate = getNiceDate;
module.exports.formatMessageDate = formatMessageDate;
module.exports.stripMessageDate = stripMessageDate;
