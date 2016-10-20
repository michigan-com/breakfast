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
  let y = canvasStyle.height - (height * 1.15);
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
  const smallCanvas = !leftOrRightPosition && scoreContainerMetrics.width === 800;

  // Team abbr
  let width = scoreContainerMetrics.width * 0.40;
  let height = scoreContainerMetrics.height;
  if (leftOrRightPosition) {
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

  const fontSize = smallCanvas ? writableHeight * 0.4 : writableHeight * 0.5;

  // logo stuff
  const logoHeight = writableHeight * 0.7;
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
    } else {
      scoreTop = height - (height * 0.3) - (fontSize / 2);
    }
  } else if (teamIndex === 1) {
    scoreLeft = scoreContainerMetrics.width - width;
  }
  const scoreMetrics = { scoreTop, scoreLeft, scoreWidth };

  // if the team doesnt have a logo we draw the whole team name
  let teamNameTextAlign = 'left';
  let teamNameLeft = scoreContainerMetrics.x + paddingLeft;
  let teamNameTop = logoTop;
  if (leftOrRightPosition) {
    teamNameTextAlign = 'center';
    teamNameLeft = scoreContainerMetrics.x;
    if (teamIndex === 1) teamNameTop = (scoreContainerMetrics.height * 0.85) - (fontSize);
  } else if (teamIndex === 1 && !leftOrRightPosition) {
    teamNameTextAlign = 'right';
    teamNameLeft = (scoreContainerMetrics.x + scoreContainerMetrics.width - width + scoreWidth);
  }
  const teamNameContainerMetrics = {
    teamNameTop,
    teamNameLeft,
    teamNameWidth: leftOrRightPosition ? scoreContainerMetrics.width : width - (scoreWidth * 1.5),
    textAlign: teamNameTextAlign,
  };


  return { width, height, paddingTop, paddingLeft, writableHeight, fontSize, drawTop,
    logoContainerMetrics, abbrContainerMetrics, teamNameContainerMetrics, scoreMetrics };
}

function drawTeamScore(context, teamContainerMetrics, team, score) {
  const { fontSize, logoContainerMetrics, abbrContainerMetrics,
    teamNameContainerMetrics, scoreMetrics } = teamContainerMetrics;

  context.fillStyle = 'white';
  context.font = `normal ${fontSize}px Futura Today`;
  context.textBaseline = 'top';

  // Draw abbr and logo if we have it
  if (team.teamAbbr && team.logo) {
    // draw abbreviation
    const { abbrTop, abbrLeft, abbrWidth } = abbrContainerMetrics;
    const abbrString = team.teamAbbr;
    const teamAbbrTextWidth = measureWord(context, abbrString);
    const teamAbbrDrawLeft = abbrLeft + ((abbrWidth - teamAbbrTextWidth) / 2);
    if (team.teamAbbr) {
      context.fillText(team.teamAbbr, teamAbbrDrawLeft, abbrTop);
    } else {
      const oldStroke = context.strokeStyle;
      context.strokeStyle = 'white';
      context.strokeRect(teamAbbrDrawLeft, abbrTop, teamAbbrTextWidth, fontSize);
      context.strokeStyle = oldStroke;
    }

    // draw logo
    const { logoHeight, logoWidth, logoTop, logoLeft } = logoContainerMetrics;
    if (team.logo !== null) {
      context.drawImage(team.logo, logoLeft, logoTop, logoWidth, logoHeight);
    } else {
      const oldStroke = context.strokeStyle;
      context.strokeStyle = 'white';
      context.strokeRect(logoLeft, logoTop, logoWidth, logoHeight);
      context.strokeStyle = oldStroke;
    }

  // Else just draw the team name
  } else if (team.teamName) {
    const { teamNameTop, teamNameLeft, teamNameWidth, textAlign } = teamNameContainerMetrics;
    const teamNameString = team.teamName;
    let drawTop = teamNameTop;

    const stringWidth = measureWord(context, teamNameString);
    if (stringWidth < teamNameWidth) drawTop = teamNameTop + (fontSize * 0.33);
    fillAllText(context, teamNameString, teamNameLeft, drawTop, teamNameWidth,
      fontSize, textAlign);
  } else {
    const oldStroke = context.strokeStyle;
    const { teamNameTop, teamNameLeft, teamNameWidth } = teamNameContainerMetrics;
    context.strokeStyle = 'white';
    context.strokeRect(teamNameLeft, teamNameTop, teamNameWidth, fontSize * 2);
    context.strokeStyle = oldStroke;
  }

  // draw score
  context.font = `bold ${fontSize}px Futura Today`;
  const { scoreTop, scoreLeft, scoreWidth } = scoreMetrics;
  const scoreString = score || '0';
  const teamScoreTextWidth = measureWord(context, scoreString);
  const teamScoreDrawLeft = (scoreLeft) + ((scoreWidth - teamScoreTextWidth) / 2);
  if (score) {
    context.fillText(score, teamScoreDrawLeft, scoreTop);
  } else {
    const oldStroke = context.strokeStyle;
    context.strokeStyle = 'white';
    context.strokeRect(teamScoreDrawLeft, scoreTop, teamScoreTextWidth, fontSize);
    context.strokeStyle = oldStroke;
  }
}

function drawTime(context, canvasStyle, scoreContainerMetrics, position, time) {
  const fontSize = canvasStyle.width * 0.03;
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
  for (let i = 0; i < scoreData.teams.length; i++) {
    const team = scoreData.teams[i];
    const score = scoreData.teamScores[i];
    const teamContainerMetrics = getTeamContainerMetrics(scoreContainerMetrics, position, i);
    drawTeamScore(context, teamContainerMetrics, team, score);
  }
}

function drawBackgroundRect(context, canvasStyle, scoreContainerMetrics, position) {
  const { height, width, x, y } = scoreContainerMetrics;

  const backgroundHeight = height * 1.25;

  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient#Using_the_createLinearGradient_method
  // default is "bottom"
  let linearStartX = 0;
  let linearStartY = canvasStyle.height;
  let linearEndX = 0;
  let linearEndY = canvasStyle.height - backgroundHeight;
  let backgroundY = linearEndY;

  if (position === 'top') {
    backgroundY = 0;
    linearStartY = 0;
    linearEndY = backgroundHeight;
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
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
  gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
  context.fillStyle = gradient;
  context.fillRect(x, backgroundY, width, backgroundHeight);
}

export default function updateSports(context, canvasStyle, Sports) {
  const position = Sports.positionOptions[Sports.currentPositionIndex];
  const scoreContainerMetrics = getScoreContainerMetrics(canvasStyle, position);

  drawBackgroundRect(context, canvasStyle, scoreContainerMetrics, position);
  drawScore(context, canvasStyle, scoreContainerMetrics, position, Sports.scoreData);
  drawTime(context, canvasStyle, scoreContainerMetrics, position, Sports.scoreData.time);
}
