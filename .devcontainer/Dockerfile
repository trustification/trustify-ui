# Image tag should match package.json > @playwright/test
FROM mcr.microsoft.com/playwright:v1.55.0-jammy

RUN apt update && \
    apt install sudo && \
    usermod -aG sudo pwuser  && \
    echo "%sudo ALL=(ALL) NOPASSWD:ALL" | tee -a /etc/sudoers > /dev/null

RUN chown pwuser:pwuser -R /home/pwuser
USER pwuser