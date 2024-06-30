#!/bin/bash

cd BudgetEye/
git pull
cd front/
npm install
npm run build
cd ..
pm2 restart all