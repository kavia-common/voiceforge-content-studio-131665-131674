#!/bin/bash
cd /home/kavia/workspace/code-generation/voiceforge-content-studio-131665-131674/voiceforge_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

