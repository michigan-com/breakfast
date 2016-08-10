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

function getTeamContainerMetrics(scoreContainerMetrics, position, teamIndex) {
  const leftOrRightPosition = /right|left/.test(position);

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
  if (leftOrRightPosition) {
    writableHeight /= 2;
  }

  let drawTop = scoreContainerMetrics.y + ((height - writableHeight) / 2);
  if (leftOrRightPosition) {
    drawTop = scoreContainerMetrics.y + paddingTop;
    if (teamIndex === 1) drawTop += height;
  }

  const fontSize = writableHeight * 0.5;

  // logo stuff
  const logoHeight = writableHeight * 0.75;
  const logoWidth = logoHeight;
  let logoTop = drawTop + ((writableHeight - logoHeight) / 2);
  let logoLeft = scoreContainerMetrics.x + paddingLeft;
  if (leftOrRightPosition) {
    logoTop = (height * 0.3) - (logoHeight / 2);
    if (teamIndex === 1) logoTop = scoreContainerMetrics.height - (logoHeight / 2) - (height * 0.3);
  } else if (teamIndex === 1) {
    logoLeft = scoreContainerMetrics.width - logoWidth - paddingLeft;
  }
  const logoContainerMetrics = { logoHeight, logoWidth, logoTop, logoLeft };

  // abbr stuff
  let abbrTop = drawTop + paddingTop + ((writableHeight - fontSize) / 2);
  let abbrLeft = scoreContainerMetrics.x;
  let abbrWidth = width;
  if (leftOrRightPosition) {
    abbrWidth = width - logoWidth;
    abbrTop = (height * 0.3) - (fontSize / 2);
    abbrLeft = abbrLeft + logoWidth;
    if (teamIndex === 1) abbrTop = scoreContainerMetrics.height - (fontSize / 2) - (height * 0.3);
  } else if (teamIndex === 1) {
    abbrLeft = scoreContainerMetrics.width - width;
  }

  const abbrContainerMetrics = { abbrTop, abbrLeft, abbrWidth };

  // score stuff
  let scoreWidth = logoWidth;
  let scoreTop = abbrTop;
  let scoreLeft = width - scoreWidth;
  if (leftOrRightPosition) {
    scoreWidth = scoreContainerMetrics.width;
    scoreLeft = scoreContainerMetrics.x;
    if (teamIndex === 1) {
      scoreTop = scoreContainerMetrics.height - height + (height * 0.3) - (fontSize / 2);
    }
    else {
      scoreTop = height - (height * 0.3) - (fontSize / 2);
    }
  } else if (teamIndex === 1) {
    scoreLeft = scoreContainerMetrics.width - width;
  }
  const scoreMetrics = { scoreTop, scoreLeft, scoreWidth };

  return { width, height, paddingTop, paddingLeft, writableHeight, fontSize, drawTop,
    logoContainerMetrics, abbrContainerMetrics, scoreMetrics };
}

function drawTeamScore(context, canvasMetrics, teamContainerMetrics, team, score, teamIndex) {
  const { x } = canvasMetrics;
  const { width, paddingLeft, fontSize, logoContainerMetrics, abbrContainerMetrics,
    scoreMetrics } = teamContainerMetrics;

  // draw abbreviation
  context.fillStyle = 'white';
  context.font = `normal ${fontSize}px Futura Today`;
  context.textBaseline = 'top';
  const { abbrTop, abbrLeft, abbrWidth } = abbrContainerMetrics;
  const teamAbbrTextWidth = measureWord(context, team.teamAbbr);
  const teamAbbrDrawLeft = abbrLeft + ((abbrWidth - teamAbbrTextWidth) / 2);
  context.fillText(team.teamAbbr, teamAbbrDrawLeft, abbrTop);

  // draw score
  context.font = `bold ${fontSize}px Futura Today`;
  const { scoreTop, scoreLeft, scoreWidth } = scoreMetrics;
  const teamScoreTextWidth = measureWord(context, score);
  const teamScoreDrawLeft = (scoreLeft) + ((scoreWidth - teamScoreTextWidth) / 2);
  context.fillText(score, teamScoreDrawLeft, scoreTop);

  // draw logo
  if (team.logo !== null) {
    const { logoHeight, logoWidth, logoTop, logoLeft } = logoContainerMetrics;
    context.drawImage(team.logo, logoLeft, logoTop, logoWidth, logoHeight);
  }
}

function drawTime(context, canvasStyle, scoreContainerMetrics, position, time) {
  const fontSize = canvasStyle.width * 0.02;
  const { height, width, y } = scoreContainerMetrics;
  context.fillStyle = 'white';
  context.font = `normal ${fontSize}px Futura Today`;
  context.textBaseline = 'top';

  let timeContainerWidth = width * 0.2;
  let timeDrawLeft = (width - timeContainerWidth) / 2;
  if (/right|left/.test(position)) {
    timeContainerWidth = width;
    timeDrawLeft = scoreContainerMetrics.x;
  }
  const timeDrawTop = y + ((height - fontSize) / 2);
  fillAllText(context, time, timeDrawLeft, timeDrawTop, timeContainerWidth, fontSize, 'center');
}

function drawScore(context, canvasStyle, scoreContainerMetrics, position, scoreData) {
  // first logo
  const { width, height } = scoreContainerMetrics;
  let { x, y } = scoreContainerMetrics;
  for (let i = 0; i < scoreData.teams.length; i++) {
    const team = scoreData.teams[i];
    const score = scoreData.teamScores[i];
    const teamContainerMetrics = getTeamContainerMetrics(scoreContainerMetrics, position, i);
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
