printer(){
  printf '\n' && printf '=%.0s' {1..40} && printf '\n'
  echo $1
  printf '=%.0s' {1..40} && printf '\n'
}

APP_DIR="/srv/sites/breakfast"

cd $APP_DIR

printer "Deploying breakfast web app ..."

printer "Grabbing latest source ..."
git pull origin master

printer "Installing node modules ..."
npm install

printer "Running gulp tasks ..."
gulp

printer "Generating logo information ..."
gulp generateLogoJson

printer "Restarting server ..."
supervisorctl restart breakfast
