'use strict';

import { fillAllText } from './text';

const HORIZONTAL_HEIGHT_PERCENT = 0.2;
const VERTICAL_WIDTH_PERCENT = 0.33;

/* eslint-disable no-param-reassign */

function measureWord(context, word) {
  const metrics = context.measureText(word);
  return metrics.width;
}

function getScoreContainerMetrics(canvasStyle, position) {
  let height = canvasStyle.height * HORIZONTAL_HEIGHT_PERCENT;
  let width = canvasStyle.width;
  if (/left|right/.test(position)) {
    width = canvasStyle.width * VERTICAL_WIDTH_PERCENT;
    height = canvasStyle.height;
  }

  let x = 0;
  let y = canvasStyle.height - height;
  if (position === 'top') {
    y = 0;
  } else if (position !== 'bottom') {
    y = 0;
    if (position === 'right') {
      x = canvasStyle.width - width;
    }
  }

  return { width, height, y, x };
}

function getTeamContainerMetrics(scoreContainerMetrics, position) {
  // Team abbr
  let width = scoreContainerMetrics.width * 0.40;
  let height = scoreContainerMetrics.height;
  if (/right|left/.test(position)) {
    width = scoreContainerMetrics.width;
    height = scoreContainerMetrics.height * 0.45;
  }

  const paddingTop = height * 0.05;
  const paddingLeft = width * 0.05;
  let writableHeight = height * 0.8;
  if (/right|left/.test(position)) {
    writableHeight /= 2;
  }

  const fontSize = writableHeight * 0.5;
  return { width, height, paddingTop, paddingLeft, writableHeight, fontSize };
}

function drawTeamScore(context, canvasMetrics, teamContainerMetrics, team, score, teamIndex) {
  const { x, y } = canvasMetrics;
  const { height, width, paddingLeft, writableHeight, fontSize } = teamContainerMetrics;

  const drawTop = y + ((height - writableHeight) / 2);

  // draw abbreviation
  context.fillStyle = 'white';
  context.font = `normal ${fontSize}px Futura Today`;
  context.textBaseline = 'top';
  const teamAbbrTextWidth = measureWord(context, team.teamAbbr);
  const teamAbbrDrawLeft = x + ((width - teamAbbrTextWidth) / 2);
  const teamAbbrDrawTop = drawTop + ((writableHeight - fontSize) / 2);
  context.fillText(team.teamAbbr, teamAbbrDrawLeft, teamAbbrDrawTop);

  // draw score
  context.font = `bold ${fontSize}px Futura Today`;
  const teamScoreTextWidth = measureWord(context, score);
  let teamScoreDrawLeft = (x + width) - teamScoreTextWidth - paddingLeft;
  if (teamIndex === 1) {
    teamScoreDrawLeft = x + paddingLeft;
  }
  context.fillText(score, teamScoreDrawLeft, teamAbbrDrawTop);

  // draw logo
  if (team.logo !== null) {
    const logoHeight = writableHeight * 0.75;
    const logoDrawTop = drawTop + ((writableHeight - logoHeight) / 2);
    let logoDrawLeft = x + paddingLeft;
    if (teamIndex === 1) {
      logoDrawLeft = x + width - logoHeight - paddingLeft;
    }
    context.drawImage(team.logo, logoDrawLeft, logoDrawTop, logoHeight, logoHeight);
  }
}

function drawTime(context, canvasStyle, scoreContainerMetrics, position, time) {
  const fontSize = canvasStyle.width * 0.02;
  const { height, width, x, y } = scoreContainerMetrics;
  context.fillStyle = 'white';
  context.font = `normal ${fontSize}px Futura Today`;
  context.textBaseline = 'top';

  const timeDrawLeft = x;
  const timeDrawTop = y + ((height - fontSize) / 2);
  fillAllText(context, time, timeDrawLeft, timeDrawTop, width, fontSize, 'center');
}

function drawScore(context, canvasStyle, scoreContainerMetrics, position, scoreData) {
  // first logo
  const { width, height } = scoreContainerMetrics;
  let { x, y } = scoreContainerMetrics;
  for (let i = 0; i < scoreData.teams.length; i++) {
    const team = scoreData.teams[i];
    const score = scoreData.teamScores[i];
    const teamContainerMetrics = getTeamContainerMetrics(scoreContainerMetrics, position);
    drawTeamScore(context, { x, y }, teamContainerMetrics, team, score, i);

    if (/right|left/.test(position)) {
      y = height - teamContainerMetrics.height;
    } else if (/bottom|top/.test(position)) {
      x = width - teamContainerMetrics.width;
    }
  }
}

function drawBackgroundRect(context, canvasStyle, scoreContainerMetrics, position) {
  const { height, width, x, y } = scoreContainerMetrics;

  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient#Using_the_createLinearGradient_method
  // default is "bottom"
  let linearStartX = 0;
  let linearStartY = canvasStyle.height;
  let linearEndX = 0;
  let linearEndY = canvasStyle.height - height;

  if (position === 'top') {
    linearStartY = 0;
    linearEndY = height;
  } else if (position !== 'bottom') {
    linearStartY = 0;
    linearEndY = 0;
    if (position === 'left') {
      linearEndX = width;
    } else if (position === 'right') {
      linearStartX = canvasStyle.width;
      linearEndX = canvasStyle.width - width;
    }
  }


  const gradient = context.createLinearGradient(linearStartX, linearStartY, linearEndX, linearEndY);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
  gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.2)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
  context.fillStyle = gradient;
  context.fillRect(x, y, width, height);
}

export default function updateSports(context, canvasStyle, Sports) {
  const position = Sports.positionOptions[Sports.currentPositionIndex];
  const scoreContainerMetrics = getScoreContainerMetrics(canvasStyle, position);

  drawBackgroundRect(context, canvasStyle, scoreContainerMetrics, position);
  drawScore(context, canvasStyle, scoreContainerMetrics, position, Sports.scoreData);
  drawTime(context, canvasStyle, scoreContainerMetrics, position, Sports.scoreData.time);
}
