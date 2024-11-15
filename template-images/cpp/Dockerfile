FROM node:20-alpine
USER root

RUN apk update
RUN apk add --no-cache \
  curl \
  python3 \
  make \
  build-base \
  krb5-dev \
  alpine-sdk \
  bash \
  libstdc++ \
  libc6-compat

RUN npm -g i code-server@4.93.1 --unsafe-perm

RUN rm -f ~/.config/code-server/config.yaml && \
  mkdir -p ~/.config/code-server/ && \
  echo "bind-addr: 0.0.0.0:80" >> ~/.config/code-server/config.yaml && \
  echo "auth: none" >> ~/.config/code-server/config.yaml && \
  echo "cert: false" >> ~/.config/code-server/config.yaml

RUN code-server --install-extension spacebox.monospace-idx-theme

RUN mkdir -p ~/.local/share/code-server/User/
RUN curl -o ~/.local/share/code-server/User/settings.json https://gist.githubusercontent.com/kshitizrohilla/0ee89f41b662ebf302e730d66733a7c5/raw/ebe5c4214b366b3700544c8fc36840be8637bbef/settings.json
RUN mkdir -p ~/app
WORKDIR /home/app

RUN curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /usr/bin/cloudflared
RUN chmod +x /usr/bin/cloudflared

COPY main.cpp ./main.cpp

EXPOSE 80

ENTRYPOINT ["code-server", "."]