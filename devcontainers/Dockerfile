ARG DOCKER_IMAGE=ubuntu:18.04
FROM ${DOCKER_IMAGE}
RUN export DEBIAN_FRONTEND=noninteractive DEBCONF_NONINTERACTIVE_SEEN=true && apt-get -q update && \
    apt-get -q install -y \
    ca-certificates curl git unzip && \
    rm -rf /var/lib/apt/lists/* && \
    curl -fsSL https://deno.land/x/install/install.sh | DENO_INSTALL=/usr/local sh && \
    apt-get purge --auto-remove -y curl unzip && \
    useradd -m bot

## Add Charles Proxy's certificate
# RUN mkdir -p /usr/share/ca-certificates/extra
# ADD charles-ssl-proxying-certificate.crt /usr/share/ca-certificates/extra/charles-ssl-proxying-certificate.crt
# RUN echo extra/charles-ssl-proxying-certificate.crt>>/etc/ca-certificates.conf
# RUN update-ca-certificates

ENV DENO_TLS_CA_STORE=system
