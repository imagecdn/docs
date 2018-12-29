FROM jekyll/jekyll
RUN apk --no-cache add py-pygments python
RUN gem install jekyll-paginate jekyll-assets jekyll-minifier pygments.rb
COPY . /srv/jekyll/
RUN jekyll build -tV && cp -r _site /tmp/_site

FROM nginx
EXPOSE 80
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /tmp/_site /usr/share/nginx/html
