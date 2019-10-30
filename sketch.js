let charRNN;
let textInput;
let lengthSlider;
let tempSlider;
let button;
let runningInference = false;

function setup() {
  noCanvas();

  // Create the LSTM Generator passing it the model directory
  dinoNames = ml5.charRNN('./models/dinomodel/', dinoNamesReady);
  dinoDescriptions = ml5.charRNN('./models/dinodescriptions/', dinoDescriptionsReady);

  // name
  textInput = select('#textInput');
  lengthSlider = select('#lenSlider');
  tempSlider = select('#tempSlider');
  // description
  lengthSliderDescr = select('#lenSliderDescr');
  tempSliderDescr = select('#tempSliderDescr');
  buttonName = select('#generateName');
  buttonDescr = select('#generateDescr');

  // DOM element events
  buttonName.mousePressed(generateName);
  buttonDescr.mousePressed(generateDescription);
  lengthSlider.input(updateSliders);
  tempSlider.input(updateSliders);
  lengthSliderDescr.input(updateSliders);
  tempSliderDescr.input(updateSliders);
}

// Update the slider values
function updateSliders() {
  select('#lengthName').html(lengthSlider.value());
  select('#temperatureName').html(tempSlider.value());
  select('#lengthDescr').html(lengthSliderDescr.value());
  select('#temperatureDescr').html(tempSliderDescr.value());
}

function dinoNamesReady() {
  select('#statusName').html('Model Loaded');
}

function dinoDescriptionsReady() {
  select('#statusDescr').html('Model Loaded');
}

// Generate new text
function generateName() {
  // prevent starting inference if we've already started another instance
  // TODO: is there better JS way of doing this?
 if(!runningInference) {
    runningInference = true;

    let original = textInput.value();
    // Update the status log
    select('#statusName').html('Generating...');
    
    // Grab the original text
    // Make it to lower case

    // Check if there's something to send
    if (original.length > 0) {
      // This is what the LSTM generator needs
      // Seed text, temperature, length to outputs
      // TODO: What are the defaults?
      let data = {
        seed: original,
        temperature: tempSlider.value(),
        length: lengthSlider.value()
      };

      // Generate text with the charRNN
      dinoNames.generate(data, gotData);

      // When it's done
      function gotData(err, result) {
        // Update the status log
        select('#statusName').html('Ready!');
        select('#nameResult').html((original + result.sample).toUpperCase());
        runningInference = false;
      }
    }
  }
}

function generateDescription() {
  // prevent starting inference if we've already started another instance
  // TODO: is there better JS way of doing this?
  if(!runningInference) {
    runningInference = true;

    let original = textInput.value();
    select('#statusDescr').html('Generating...');
    
    let data = {
      seed: original,
      temperature: tempSliderDescr.value(),
      length: lengthSliderDescr.value()
    }

    // Generate text with the charRNN
    dinoDescriptions.generate(data, gotData);

    // When it's done
    function gotData(err, result) {
      select('#statusDescr').html('Ready!');
      select('#descriptionResult').html(result.sample);
      runningInference = false;
    }
  }
}
