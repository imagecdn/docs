# Generate the static site with Github Pages
FROM jekyll/jekyll
RUN apk --no-cache add py-pygments python
RUN gem install bundler
COPY Gemfile Gemfile.lock ./
RUN bundle install
COPY . /srv/jekyll/
RUN jekyll build -tV && cp -r _site /tmp/_site

# Build the nginx website, baking in the static site.
FROM nginx
EXPOSE 80
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /tmp/_site /usr/share/nginx/html
