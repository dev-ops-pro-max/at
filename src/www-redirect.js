// Canonical hostname for browser visits and link-preview crawlers.
export default {
  fetch(request) {
    const url = new URL(request.url);
    url.protocol = 'https:';
    url.hostname = 'amaravathitravels.com';
    url.port = '';
    return Response.redirect(url.toString(), 308);
  }
};
