# Download and compile re2c from source
RE2C_VERSION=4.0.2

wget https://github.com/skvadrik/re2c/releases/download/${RE2C_VERSION}/re2c-${RE2C_VERSION}.tar.xz ;

tar -xf re2c-${RE2C_VERSION}.tar.xz ;
cd re2c-${RE2C_VERSION} \
    && ./configure \
    && make \
    && sudo make install;

re2c --version
