# Download and compile re2c from source
ARG RE2C_VERSION=3.1
RUN wget https://github.com/re2c/re2c/releases/download/${RE2C_VERSION}/re2c-${RE2C_VERSION}.tar.gz \
    && tar xzf re2c-${RE2C_VERSION}.tar.gz \
    && cd re2c-${RE2C_VERSION} \
    && ./configure \
    && make \
    && make install \
    && cd .. \
    && rm -rf re2c-${RE2C_VERSION}* # Clean up source files

# Verify re2c installation (optional)
RUN re2c --version
