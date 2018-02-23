const request = require('request-promise-native');
const { token, email, timeout_in_seconds } = require('./config.json');
const url = `https://api.hipchat.com/v2/user/${email}`;

main();

async function getUser(token, url) {
  return request.get(url, {
    auth: {
      bearer: token,
    },
    json: true,
  });
}

function updateUser(token, url, user) {
  request.put(url, {
    auth: {
      bearer: token,
    },
    json: true,
    body: user,
  });
}

async function main() {
  const user = await getUser(token, url);

  user.presence.show = 'xa';
  await updateUser(token, url, user);
  console.log(`${email} is now away for ${timeout_in_seconds} seconds...`);
  setTimeout(async () => {
    user.presence.show = 'chat';
    await updateUser(token, url, user);
    console.log(`... ${email} is now active!`);
  }, timeout_in_seconds * 1000);
}
