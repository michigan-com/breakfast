'use strict';

import { fillAllText } from './text';

const HORIZONTAL_HEIGHT_PERCENT = 0.10;
const VERTICAL_WIDTH_PERCENT = 0.33;

/* Rectangle: */
// opacity: 0.75;
// background-image: linear-gradient(-90deg, #000000 50%, rgba(0,0,0,0.10) 100%);

function measureWord(context, word) {
  const metrics = context.measureText(word);
  return metrics.width;
}

function getScoreContainerHeight(canvasStyle) {
  // TODO pivot based on layout type
  return canvasStyle.width * HORIZONTAL_HEIGHT_PERCENT;
}

function getScoreContainerWidth(canvasStyle) {
  // TODO pivot based on layout type
  return canvasStyle.width * 0.45;
}

function getTimeContainerWidth(canvasStyle) {
  // TODO pivot based on layout type
  return canvasStyle.width * 0.1;
}

function drawTeamScore(context, canvasStyle, team, score, leftStart, logoFlip) {
  const height = canvasStyle.width * 0.08;
  const smallWidth = height;
  const largeWidth = smallWidth * 3;
  const scoreContainerHeight = getScoreContainerHeight(canvasStyle);
  const drawTop = canvasStyle.height - scoreContainerHeight + ((scoreContainerHeight - height) / 2);
  const scoreContainerWidth = getScoreContainerWidth(canvasStyle);
  const fontSize = height * 0.5;
  const sidePadding = scoreContainerWidth * 0.05;

  // draw abbreviation
  context.fillStyle = 'white';
  context.font = `normal ${fontSize}px Futura Today`;
  context.textBaseline = 'top';
  const teamAbbrTextWidth = measureWord(context, team.teamAbbr);
  const teamAbbrDrawLeft = leftStart + ((scoreContainerWidth - teamAbbrTextWidth) / 2);
  const teamAbbrDrawTop = drawTop + ((height - fontSize) / 2);
  context.fillText(team.teamAbbr, teamAbbrDrawLeft, teamAbbrDrawTop);

  // draw score
  context.font = `bold ${fontSize}px Futura Today`;
  const teamScoreTextWidth = measureWord(context, score);
  let teamScoreDrawLeft = 0;
  if (logoFlip) {
    teamScoreDrawLeft = leftStart + sidePadding;
  } else {
    teamScoreDrawLeft = (leftStart + scoreContainerWidth) - teamScoreTextWidth - sidePadding;
  }
  context.fillText(score, teamScoreDrawLeft, teamAbbrDrawTop);


  // draw logo
  if (team.logo !== null) {
    const logoHeight = height * 0.75;
    const logoDrawTop = drawTop + ((height - logoHeight) / 2);
    let logoDrawLeft = 0;
    if (logoFlip) {
      logoDrawLeft = (leftStart + scoreContainerWidth) - logoHeight - sidePadding;
    } else {
      logoDrawLeft = leftStart + sidePadding;
    }
    context.drawImage(team.logo, logoDrawLeft, logoDrawTop, logoHeight, logoHeight);
  }
}

function drawTime(context, canvasStyle, time) {
  const fontSize = canvasStyle.width * 0.02;
  const containerHeight = getScoreContainerHeight(canvasStyle);
  const containerWidth = getTimeContainerWidth(canvasStyle);
  context.fillStyle = 'white';
  context.font = `normal ${fontSize}px Futura Today`;
  context.textBaseline = 'top';

  const timeDrawLeft = (canvasStyle.width - containerWidth) / 2;
  const timeDrawTop = (canvasStyle.height - containerHeight) + ((containerHeight - fontSize) / 2);
  fillAllText(context, time, timeDrawLeft, timeDrawTop, containerWidth, fontSize, 'center');
}

function drawScore(context, canvasStyle, scoreData) {
  // first logo

  let leftStart = 0;
  for (let i = 0; i < scoreData.teams.length; i++) {
    const team = scoreData.teams[i];
    const score = scoreData.teamScores[i];
    drawTeamScore(context, canvasStyle, team, score, leftStart, i === 1);
    leftStart = canvasStyle.width * 0.55;
  }
}

function drawBackgroundRect(context, canvasStyle) {
  const rectHeight = getScoreContainerHeight(canvasStyle);
  const rectTop = canvasStyle.height - rectHeight;

  const gradient = context.createLinearGradient(0, 0, canvasStyle.width, 0);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
  context.fillStyle = gradient;
  context.fillRect(0, rectTop, canvasStyle.width, rectHeight);
}

export default function updateSports(context, canvasStyle, Sports) {
  drawBackgroundRect(context, canvasStyle);

  drawScore(context, canvasStyle, Sports.scoreData);

  drawTime(context, canvasStyle, Sports.scoreData.time);
}
