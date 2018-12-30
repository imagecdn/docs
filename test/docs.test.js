const chai = require("chai");
const expect = require("chai").expect;
const URL = require("url").URL;

console.log(process.env.IMAGECDN_DOC_HOST);

chai.use(require("chai-http"));

function makeRequest(url) {
  const { host, pathname, search } = new URL(url);

  let request = chai
    .request(process.env.IMAGECDN_DOCS_HOST || "localhost")
    .get(`${pathname}${search}` || "")
    .set("Host", host)
    .set("Accept", "*/*")
    .set("Accept-Encoding", "gzip, deflate");

  return request
    .redirects(0)
    .then(res => res || Promise.reject(res))
    .catch(err => {
      if (!err.response) {
        throw err;
      }

      return err.response;
    });
}

[
  "responsiveimages.io",
  "www.responsiveimages.io",
  "www.imagecdn.app"
].forEach(domain => {
  it(`Redirects apex domain ${domain} to https://imagecdn.app/`, () => {
    return makeRequest(`http://${domain}`).then(res => {
      expect(res).to.redirect;
      expect(res).to.redirectTo("https://imagecdn.app/");
    });
  });
});

["https://imagecdn.app/about.html", "https://imagecdn.app/about/"].forEach(
  url => {
    it(`Rewrites ${url} to http://imagecdn.app/about`, () => {
      return makeRequest(url).then(res => {
        expect(res).to.redirect;
        expect(res).to.redirectTo("http://imagecdn.app/about");
      });
    });
  }
);

it(`Serves the index page`, () => {
  return makeRequest("https://imagecdn.app/").then(res => {
    expect(res).to.be.html;
    expect(res).to.not.redirect;
    expect(res).to.have.status(200);
  });
});

it(`Serves the 404 page`, () => {
  const url = `https://imagecdn.app/not-found-${Date.now()}`;
  return makeRequest(url).then(res => {
    expect(res).to.be.have.status(404);
    expect(res).to.be.html;
    expect(res).to.not.redirect;
  });
});

it(`Should not serve the README`, () => {
  const url = `https://imagecdn.app/readme`;
  return makeRequest(url).then(res => {
    expect(res).to.be.have.status(404);
    expect(res).to.be.html;
    expect(res).to.not.redirect;
  });
});
