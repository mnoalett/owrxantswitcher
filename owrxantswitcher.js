// Antenna switch UI plugin for OpenWebRX+
// License: MIT
// Original Example File Copyright (c) 2023 Stanislav Lechev [0xAF], LZ2SLL
//
// Modified by DL9UL to provide UI buttons used to call a WebAPI

// Init function of the plugin
Plugins.owrxantswitcher.init = function () {

  // Function to send a letter via POST
  function sendLetter(letter) {
    // Use the base URL of the main document with port 5001
    const apiEndpoint = `HTTP://${window.location.hostname}:5001/antennaswitch`;

    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command: letter }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      updateButtonState(data.payload.response);
      //console.log('Success:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  // Function to update the button state based on the active antenna
  function updateButtonState(activeAntenna) {
     for (let i = 1; i <= 4; i++) {
      const button = document.getElementById(`owrx-ant-button-${i}`);
      button.classList.remove('highlighted');
      
      if (i.toString() === activeAntenna) {
        button.classList.add('highlighted');
      }
    }
  }

  // Create a openwebrx-section
  const antSection = document.createElement('div');
  antSection.classList.add('openwebrx-section');

  const antPanelLine = document.createElement('div');
  antPanelLine.classList.add('openwebrx-ant','openwebrx-panel-line');
  antSection.appendChild(antPanelLine);


// Create buttons and add them to the container
  const antGrid = document.createElement('div');
  antGrid.classList.add('openwebrx-ant-grid');
  antPanelLine.appendChild(antGrid);

  for (let i = 1; i <= 4; i++) {
    const button = document.createElement('div');
    button.id = `owrx-ant-button-${i}`;
    button.classList.add('openwebrx-button');
    button.textContent = `Ant ${i}`;
    button.onclick = function () {
      const letter = String(i);
      sendLetter(letter);
    };
    antGrid.appendChild(button);
  }

  // Section Divider to hide ANT panel
  const antSectionDivider = document.createElement('div');
  antSectionDivider.id = 'openwebrx-section-ant';
  antSectionDivider.classList.add('openwebrx-section-divider');
  antSectionDivider.onclick = function() { UI.toggleSection(this);};
  antSectionDivider.innerHTML = "&blacktriangledown;&nbsp;Ant"; 

  // Append the container above the "openwebrx-section-modes"
  const targetElement = document.getElementById('openwebrx-section-modes');
  targetElement.parentNode.insertBefore(antSectionDivider, targetElement);      
  targetElement.parentNode.insertBefore(antSection, targetElement);

  // Retrieve initial button configuration
  sendLetter("s");

  return true;
};
