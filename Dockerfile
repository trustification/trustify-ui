# Builder image
FROM docker.io/library/fedora:40 as builder

COPY . /usr/src
WORKDIR /usr/src

RUN touch ~/.bashrc && chmod +x ~/.bashrc
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
RUN . ~/.nvm/nvm.sh && source ~/.bashrc && \
nvm install 20 && nvm alias default 20 && nvm use default && \
npm clean-install --ignore-scripts && npm run build --dev