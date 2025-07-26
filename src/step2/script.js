document.addEventListener("DOMContentLoaded", () => {
  const messages = [
    { text: "签到成功！", duration: 1400, type: "static" },
    {
      text: "用时：<span class='time-used'>{time} s</span><br>排名：第 <span class='rank'>{rank}</span> 名",
      duration: 4000,
      type: "dynamic_rank",
    },
    {
      text: "你是第<span class='hex-number'>{hex}</span>位签到游客！",
      duration: 3000,
      type: "dynamic_hex",
    },
  ];
  const MORPH_TIME = 2.0;
  const API_URL = "http://localhost:31415/api/qiandao/get";

  const text1 = document.getElementById("text1");
  const text2 = document.getElementById("text2");

  let textIndex = 0;
  let time = new Date();
  let morph = 0;
  let cooldown = messages[textIndex].duration / 1000;
  let elFrom = text1,
    elTo = text2;

  function formatToHex(num) {
    if (typeof num !== "number" || isNaN(num)) {
      return "0x???";
    }
    return "0x" + num.toString(16).toUpperCase().padStart(3, "0");
  }

  async function getDisplayData() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("获取数据失败");

      const { data, timesused } = await response.json();

      let latestTime = "N/A";
      let rank = "N/A";

      if (timesused && timesused.length > 0) {
        latestTime = timesused[timesused.length - 1].toFixed(3);
        const sortedTimes = [...timesused].sort((a, b) => a - b);
        const rankIndex = sortedTimes.indexOf(timesused[timesused.length - 1]);
        rank = rankIndex + 1;
      }

      const hexValue = formatToHex(data);
      return { hexValue, latestTime, rank };
    } catch (error) {
      console.error(error.message);
      return { hexValue: "0x???", latestTime: "N/A", rank: "N/A" };
    }
  }
  async function initialize() {
    const data = await getDisplayData();
    elFrom.innerHTML = messages[0].text;
    elTo.innerHTML = messages[1].text
      .replace("{time}", data.latestTime)
      .replace("{rank}", data.rank);

    animate();
  }

  function setMorph(fraction) {
    elTo.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    elTo.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
    fraction = 1 - fraction;
    elFrom.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    elFrom.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
  }

  function doCooldown() {
    morph = 0;
    elFrom.style.filter = "";
    elFrom.style.opacity = "100%";
    elTo.style.filter = "";
    elTo.style.opacity = "0%";
  }

  function doMorph() {
        morph -= cooldown;
        cooldown = 0;
        let fraction = morph / MORPH_TIME;

        if (fraction >= 1) {
            const temp = elFrom;
            elFrom = elTo;
            elTo = temp;

            textIndex = (textIndex + 1) % messages.length;
            
            getDisplayData().then(data => {
                const nextMessage = messages[(textIndex + 1) % messages.length];
                let newText = nextMessage.text;

                switch (nextMessage.type) {
                    case 'dynamic_rank':
                        newText = newText
                            .replace('{time}', data.latestTime)
                            .replace('{rank}', data.rank);
                        break;
                    case 'dynamic_hex':
                        newText = newText.replace('{hex}', data.hexValue);
                        break;
                }
                elTo.innerHTML = newText;
            });

            cooldown = messages[textIndex].duration / 1000;
            morph = 0;
        } else {
            setMorph(fraction);
        }
    }
  function animate() {
    requestAnimationFrame(animate);
    const newTime = new Date();
    const dt = (newTime - time) / 1000;
    time = newTime;
    cooldown -= dt;
    if (cooldown <= 0) {
      doMorph();
    } else {
      doCooldown();
    }
  }

  initialize();

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function initiatePageTransition() {
    await delay(20000);

    const overlay = document.getElementById("page-transition-overlay");

    overlay.classList.add("visible");

    await delay(3000);

    window.location.href = "http://localhost:31415/step1/index.html";
  }

  initiatePageTransition();
});
