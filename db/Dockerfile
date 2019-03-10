FROM postgres:11

# Install pgjwt extension
# https://github.com/michelp/pgjwt#install
RUN apt-get update \
    && apt-get install -y build-essential git postgresql-server-dev-11 \
    && cd tmp \
    && git clone https://github.com/michelp/pgjwt.git \
    && cd pgjwt \
    && make install \
    && cd ../..
