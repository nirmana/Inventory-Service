FROM mongo:5.0.5
COPY . /
RUN chmod +x seed.sh
CMD ["sh", "-c", "/seed.sh"]