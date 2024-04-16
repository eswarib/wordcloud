
async function getCurrentTabContent() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const contentPromise = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const textContent = document.documentElement.innerText;
        const url = window.location.href;
        console.log("getCurrentTabContent::contentscript - " + textContent.substring(0,20));
        console.log("getCurrentTabContent::url - " + url);
    
        return { textContent, url };
      },
    });
    return contentPromise[0].result;
  }
  
// Function to handle receiving word cloud image data from the server
function handleImageData(imageData) {
    console.log("imageData is");
    console.log(imageData)

    // Extract base64-encoded image data from the JSON response
    //var base64ImageData = imageData['wordcloud'];

    // Create an image element
    var img = document.createElement('img');

    // Set the source of the image to the base64-encoded image data
    img.src = 'data:image/png;base64,' + imageData;

    // Append the image to the popup
    const wordCloudDiv = document.getElementById('wordCloud');
    wordCloudDiv.innerHTML = '';
    wordCloudDiv.appendChild(img);
}


// Function to handle receiving word cloud data from content script
function handleWordCloudData(data) {
    console.log('data to form wordcloud:', data.textContent);
    // Fetch image data from Flask server
    fetch('https://wordcloud-d7f2dcbffa74.herokuapp.com/generate_wordcloud', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    //    body: JSON.stringify({ text: data }) // Send the word cloud data received from content script
    //    body: JSON.stringify({
    //        text: data.textContent,
    //    }),
          body: JSON.stringify({ text: data.textContent }) // Send the word cloud data received from content script
    })
    .then(response => response.text())
    .then(imageData => {
        handleImageData(imageData);
    })
    .catch(error => {
        console.error('Error fetching image:', error);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const content = await getCurrentTabContent();
    await handleWordCloudData(content);

    const popupWindow = window.chrome.extension.getViews({ type: 'popup' })[0];
    const body = popupWindow.document.body;
    const height = Math.min(body.scrollHeight + 40, 600); // Add 40px for padding
    chrome.windows.update(popupWindow.outerWindowId, { width, height });
  
  });

console.log("I am inside the popup.js");
