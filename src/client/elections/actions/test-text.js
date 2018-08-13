'use strict';

const LOREM_IPSUM_TEXT = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  "Nulla nec nisi semper, varius nulla quis, porta risus",
  "Curabitur quis urna ultricies, finibus risus ac, egestas ex",
  "Vestibulum ac nibh posuere, ullamcorper metus lobortis, ultrices sem",
  "Nunc nec sodales ex",
  "Vestibulum feugiat lorem nec libero cursus, et consequat dui dignissim",
  "Aenean ut consequat lectus, non commodo lacus",
  "Suspendisse potenti",
  "Ut aliquam, lorem sed condimentum rhoncus, neque mauris vestibulum dui",
  "Nulla hendrerit quis velit vitae vehicula",
  "Pellentesque ut varius felis",
  "Duis ac luctus neque",
  "Quisque quis dolor auctor, viverra tortor vel, varius velit",
  "Nunc tincidunt libero erat, vitae mattis erat interdum nec.",
  "Sed eget augue nulla",
  "Proin tristique venenatis finibus",
  "Etiam et velit ac ipsum porta molestie",
  "Duis commodo elit lectus, eu auctor magna elementum et",
  "Etiam id risus ex",
  "Nullam commodo elit ac velit facilisis, ac convallis metus finibus",
  "Praesent fringilla justo vitae tortor lacinia, non dictum enim pretium",
  "Curabitur eleifend vestibulum euismod",
  "Donec consectetur, nulla quis eleifend volutpat, justo ligula congue ipsum",
  "Sed fermentum hendrerit purus, quis condimentum tellus dictum quis",
  "Nam nunc purus, iaculis ut ultricies vel, fermentum sit amet nunc",
  "Donec ac sapien id mi fringilla hendrerit sed et libero",
  "Fusce vulputate, justo tincidunt laoreet lobortis, justo magna iaculis odio,",
  "Ut cursus sodales tempor",
  "Donec eget tempus purus, a pretium arcu",
  "Fusce a metus eget odio tincidunt pharetra."
];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

export function getIpsumText(numSentences = 1) {
  var text = '';
  for (var i = 0; i < numSentences; i++) {
    var randomIndex = getRandomInt(0, LOREM_IPSUM_TEXT.length);
    text += LOREM_IPSUM_TEXT[randomIndex];
    if (i !== (numSentences - 1)) text += ' '
  }
  return text;
}
