const CertficateAuth=artifacts.require("CertificateAuth");

module.exports = function (deployer) {
  deployer.deploy(CertficateAuth);
};
