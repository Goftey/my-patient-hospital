document.addEventListener('DOMContentLoaded', function () {
  const patientItems = document.getElementById('patient-items');
  const dashboardItems = document.getElementById('dashboard-items');

  // Function to update patient-items content
  function updatePatientItems(content) {
    patientItems.innerHTML = '';
    dashboardItems.innerHTML = '';

    const logo = document.createElement('li');
    const img = document.createElement('img');
    img.src = '/hosi.png.png';
    img.alt = 'Logo';
    img.style.width = '70px';
    img.style.margin = '1px';       
    img.style.borderRadius = '20%';
    img.style.border = '2px solid #800080';
    logo.appendChild(img);

    const heading = document.createElement('li');
    heading.className = 'dashh';
    heading.textContent = content;

    patientItems.appendChild(logo);
    patientItems.appendChild(heading);

    // Call the appropriate function to update items below hr based on the selected link
    switch (content) {
      case 'Dashboard':
        updateDashboardItems();
        break;
      case 'Appointment':
        updateAppointmentItems();
        break;
      case 'Settings':
        updateSettingsItems();
        break;
      default:
        break;
    }
  }


  // Functions to update items below the hr for each section
  function updateDashboardItems() {
    dashboardItems.innerHTML = `
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f0f0f0;
            margin: 0;
        }
    
        .claim-button {
            margin-right: 440px;
            margin-left: 980px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 17px;
            letter-spacing: 10px;
            padding-top: 4px;
            padding-bottom: 4px;
            background-color: green;
            border: none;
            transition: background-color 0.2s;
        }
        .claim-button:hover {
            background-color: blue;
            color: white;
        }
        .coin-container {
            position: relative;
            perspective: 1000px;
            margin-top: 10px;
        }
        
        .tube {
            margin-left:100px;
            margin-top:-2em;
            border-radius:10px;
            width: 210px;
            height: 9px;
            background-color: white;
            border: 2px solid grey;
            position: relative;
            overflow: hidden;
        }

        .fill {
            height: 100%;
            width: 0;
        }
        .fill-payment {
            background-color: green;
        }

        .fill-balance {
            background-color: red;
        }

        .fill-bill {
            background-color: blue;
        }
        .y-axis {
          position: absolute;
          left: 0;
          top: 0;
          width: 20px;
          height: 100%;
        }
        
        .tick {
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #000;
        }
        
        .tick.major {
          height: 4px;
          width:15px;
        }
        
        .tick.minor {
          height: 2px;
          width:7px;
        }
        .y-label {
          color:green;
          font-weight:bold;
          position: absolute;
          left: -20px;
          top: 30%;
          writing-mode: vertical-rl; /* Vertical writing */
        }
        .tick-label {
          color:brown;
          font-weight:bold;
          position: absolute;
          margin-top: -0.05em;
          left:26px;
        }
        
        .bar {
            width: calc(98% / 3); /* Divide the width equally among the bars */
            height: 0; /* Initial height of the bars */
            display: inline-block;
            margin-top:11.5em;
            align-items: flex-end; 
          }
          
          #bar1 {
            background-color:cadetblue ;
            height: 38px; /* Height of the first bar */
          }
          
          #bar2 {
            background-color:darkgoldenrod;
            height: 85px; /* Height of the second bar */
          }
          
          #bar3 {
            background-color: forestgreen;
            height: 54px; /* Height of the third bar */
          }
          
        
        
    </style>
    <div style="border: 2px solid darkgrey; border-radius: 10px; margin-left: 170px;height: 440px; margin-right: 1000px; background-color: white;">
        <div>
            <img src="/doctor.png.jpg" style="width: 200px; margin-left: 85px; margin-top: 2px; border-radius: 20%; border: 2px solid #800080;">
        </div>
        <div class="profilel" style="margin-left: 50px; margin-top: 20px;">
            <label>Username: VICTOR KIPLIMO</label>
        </div>
        <div class="profilee" style="border-radius:10px;padding-bottom:20px;border: 2px solid darkgrey;margin-left: 50px;margin-right:50px; margin-top: 20px;background-color:cornsilk;">
            <label><i class="fa-solid fa-money-bill-1-wave" style="color: #4d8217;"></i>&nbsp;PAYMENT
            <br> <span style="color:brown;font-weight:bolder;">13,274</span>
            </label>
            <div class="tube">
            <div class="fill fill-payment" id="paymentFill"></div>
            <div class="percentage-text" id="percentage-text">0%</div>
        </div>
        </div>
        <div class="profilee" style="border-radius:10px;padding-bottom:20px;border: 2px solid darkgrey;margin-left: 50px;margin-right:50px; margin-top: 20px;background-color:cornsilk;">
            <label><i class="fa-solid fa-coins" style="color: #ffc800;"></i></i>&nbsp;BALANCE
            <br> <span style="color:brown;font-weight:bolder;">16,726</span></label>
            <div class="tube">
            <div class="fill fill-balance" id="balanceFill"></div>
            <div class="percentage-text" id="percentage-text">0%</div>
        </div>
        </div>
        <div class="profilee" style="border-radius:10px;padding-bottom:20px;border: 2px solid darkgrey;margin-left: 50px;margin-right:50px; margin-top: 20px;background-color:cornsilk;">
    <label><i class="fa-solid fa-money-bills" style="color: #227c23;"></i>&nbsp;BILL
        <br> <span style="color:brown;font-weight:bolder;">30,000</span>
    </label>


            <div class="tube">
            <div class="fill fill-bill" id="billFill"></div>
            <div class="percentage-text" id="percentage-text">0%</div>
        </div>
        </div>
    </div>
    <div style="border: 2px solid darkgrey; margin-right: 620px; margin-left: 600px; margin-top: -27.5em; background-color: grey;">
        <div style="margin-left: 100px; font-size: 17px; letter-spacing: 5px;">
            <u>HEALTH POINTS</u>
        </div>
    </div>
    <div style="border:2px solid darkgrey; border-radius: 10px; margin-right: 620px; margin-left: 600px; height: 130px; margin-top: 0.2em; background-color: white;">
        <span id="incrementingNumber">00.000</span>
        <div class="coin-container">
           
        </div>
    </div>
    <div>
        <div style="margin-top:-9em;">
            <button class="claim-button">CLAIM</button>
        </div>
    </div>
   
        <div style="border:2px solid darkgrey; margin-right: 460px; margin-left: 600px; height: 270px; margin-top: 7.5em; background-color: slategray; position: relative;">
        <!-- Y-axis with black tickings -->
        <div class="y-axis">
        <div class="y-label">PERCENTAGE</div>
          <!-- Major ticks -->
          <div class="tick major" style="bottom: 1px;"></div>
          <div class="tick major" style="bottom: 54px;"><span class="tick-label">20</span></div>
          <div class="tick major" style="bottom: 108px;"><span class="tick-label">40</span></div>
          <div class="tick major" style="bottom: 162px;"><span class="tick-label">60</span></div>
          <div class="tick major" style="bottom: 216px;"><span class="tick-label">80</span></div>
          <div class="tick major" style="bottom: 267px;"></div>
          <!-- Minor ticks -->
          <div class="tick minor" style="bottom: 27px;"></div>
          <div class="tick minor" style="bottom: 81px;"></div>
          <div class="tick minor" style="bottom: 135px;"></div>
          <div class="tick minor" style="bottom: 189px;"></div>
          <div class="tick minor" style="bottom: 243px;"></div>
        </div>
        <!-- Bars -->
        <div class="bar" id="bar1"></div>
        <div class="bar" id="bar2"></div>
        <div class="bar" id="bar3"></div>
    
        <div class="x-axis" id="x-axis">
        <div class="x-label" id="day-time-label" style="left: 0;color:brown;font-weight:bolder;"></div>
      </div>
  </div>
      
  <div id="percentageContainer" style="font-weight:bolder;position:absolute; right: 0; top: 47%; transform: translateY(-50%);">
  <div class="color-box" style="position: absolute; top: -0.4px;border-radius:50%; left: -28px; width: 15px; height: 15px; background-color:cadetblue ;"></div>
  <div id="appointmentPercentage">Appointment: 0%</div>
  <div class="color-box" style="position: absolute; top: 20px;border-radius:50%; left: -28px; width: 15px; height: 15px;  background-color:darkgoldenrod;"></div>
  <div id="healthPointsPercentage">Health Points: 0%</div>
  <div class="color-box" style="position: absolute; top: 39px;border-radius:50%; left: -28px; width: 15px; height: 15px;  background-color: forestgreen;"></div>
  <div id="dietPercentage">Diet: 0%</div>
</div>
</div>
    </div>`;

    calculatePercentages();
  }

  function updateAppointmentItems() {
    dashboardItems.innerHTML = '<li>Appointment Item 1</li><li>Appointment Item 2</li>';
  }
  function updateSettingsItems() {
    dashboardItems.innerHTML = '<li>Settings Item 1</li><li>Settings Item 2</li>';
  }
  document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault();
  });

  // Event listeners for each icon button
  document.getElementById('dashboard-link').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default form submission behavior
    updatePatientItems('Dashboard');
  });

  document.getElementById('appointment-link').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default form submission behavior
    updatePatientItems('Appointment');
  });

  document.getElementById('settings-link').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default form submission behavior
    updatePatientItems('Settings');
  });

  // Call the function to initially show the dashboard
  updatePatientItems('Dashboard');
});

function calculatePercentages() {
    let payment = 13274;
    let balance = 16726;
    let bill = 30000;

    let paymentPercentage = (payment / bill) * 100;
    let balancePercentage = (balance / (payment + balance)) * 100;

    document.getElementById('paymentFill').style.width = paymentPercentage + '%';
    document.getElementById('balanceFill').style.width = balancePercentage + '%';
    document.getElementById('billFill').style.width = '100%';

    document.getElementById('paymentPercentage').textContent = paymentPercentage.toFixed(2) + '%';
    document.getElementById('balancePercentage').textContent = balancePercentage.toFixed(2) + '%';
    document.getElementById('billPercentage').textContent = '100%';
}


document.getElementById('menuToggle').addEventListener('click', function() {
  const patientContainer = document.getElementById('patient-container');
  patientContainer.classList.toggle('compressed');

  const patientItems = document.querySelector('.patient-items');
  const hiddenPage = document.querySelector('.hidden-page');
  
  if (patientContainer.classList.contains('compressed')) {
    const hiddenPageWidth = hiddenPage.offsetWidth;

    const containerWidth = patientContainer.offsetWidth;
    const availableWidth = containerWidth - hiddenPageWidth; // Calculate available width
    const maxMargin = availableWidth - patientItems.scrollWidth; // Calculate maximum allowed margin
    
    patientItems.style.marginLeft = Math.max(hiddenPageWidth, Math.min(0, maxMargin)) + 'px'; // Set margin within the available space

  } else {
    patientItems.style.marginLeft = '5px'; // Reset margin when container is decompressed
  }
});
// Function to update x-axis label with current day and time
document.addEventListener('DOMContentLoaded', function () {
  // Update day and time
  function updateDayTime() {
      const xLabel = document.getElementById('day-time-label');
      const now = new Date();
      const nairobiTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }));
      const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][nairobiTime.getDay()];
      const time = nairobiTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
      xLabel.textContent = `${day}    ${time}`;
  }

  updateDayTime(); // Update initially
  setInterval(updateDayTime, 1000); // Update every second
});
document.querySelector('.claim-button').addEventListener('click', claimPoints);
event.preventDefault();


let currentNumber = 0.000;
let totalPoints = 0.000;

function incrementNumber() {

currentNumber += 0.005;
document.getElementById('incrementingNumber').textContent = currentNumber.toFixed(3).padStart(6, '0');
}

function claimPoints() {
totalPoints += currentNumber;
document.getElementById('totalPoints').textContent = totalPoints.toFixed(3).padStart(6, '0');
currentNumber = 0.000;
document.getElementById('incrementingNumber').textContent = currentNumber.toFixed(3).padStart(6, '0');
}

updateDashboardItems();
setInterval(incrementNumber, 2000);

document.addEventListener('DOMContentLoaded', (event) => {
document.querySelector('.claim-button').addEventListener('click', claimPoints);



});