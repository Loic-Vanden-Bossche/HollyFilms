import * as puppeteer from 'puppeteer';
import * as up from 'uptobox';

import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { WebsocketService } from './websocket.service';

import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ScrapperService implements OnModuleInit {
  constructor(
    @Inject(forwardRef(() => WebsocketService))
    private readonly websocketService: WebsocketService,
    private readonly httpService: HttpService,
  ) {}

  searchEngaged = false;
  inDownloadResolver = false;

  searchProgress = '';

  onModuleInit() {
    up.setToken('2ede52f0820824ade29156d3e6a02e472vl4f');
  }

  async query(querry: string): Promise<void> {
    if (this.searchEngaged) throw 'Already engaged';

    this.searchEngaged = true;

    this.searchProgress = 'Searching for movies ...';
    this.websocketService.emit('searchProgressEvent', this.searchProgress);

    if (querry.includes('http')) {
      const resData = await firstValueFrom(this.httpService.head(querry));
      const header = resData.headers['content-type'];

      let linkInfos = null;
      let link = null;

      if (header.includes('video') || header.includes('stream')) {
        link = querry;
      } else if (querry.includes('uptobox')) {
        linkInfos = await up.getLinkInfo(querry);
        link = await up.getLink(querry);
      }

      const mediaLink = {
        downloadLink: link,
        filename: linkInfos ? linkInfos.name : link,
        size: linkInfos ? linkInfos.size : 'NO-DATA',
        utptostreamLink: linkInfos ? linkInfos.utptostreamLink : undefined,
      };

      this.websocketService.emit('mediaLinkDataEvent', {
        msg: null,
        link: mediaLink,
        timeOut: null,
      });
    } else {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.goto(
        'https://several-filez.in/?s=' + encodeURIComponent(querry),
      );

      let infos = await page.evaluate(() => {
        const arrayToReturn = [];

        for (const element of document.getElementsByClassName(
          'fusion-image-wrapper',
        )) {
          arrayToReturn.push({
            title: element.children[0].getAttribute('aria-label'),
            pageLink: element.children[0].getAttribute('href'),
            imageLink: element.children[0].children[0].getAttribute('src'),
          });
        }

        return arrayToReturn;
      });

      infos = infos.filter((info) =>
        querry
          .split(' ')
          .every((el) => info.title.toLowerCase().includes(el.toLowerCase())),
      );

      if (infos.length) {
        let shortUrlArr = [];

        for (const [i, info] of infos.entries()) {
          this.searchProgress =
            'searching for link in page ' + (i + 1) + '/' + infos.length;
          this.websocketService.emit(
            'searchProgressEvent',
            this.searchProgress,
          );

          await page.goto(info.pageLink);

          let previousLenght = shortUrlArr.length;

          shortUrlArr = shortUrlArr.concat({
            files: await page
              .evaluate(() => {
                const arrayToReturn = [];

                for (const element of document.querySelectorAll('td')) {
                  const spanElem = element.querySelectorAll('span')[1];

                  if (spanElem) {
                    if (spanElem.textContent.includes('Uptobox')) {
                      if (
                        spanElem.parentElement.parentElement.parentElement.querySelectorAll(
                          'a',
                        ).length
                      ) {
                        arrayToReturn.push({
                          link: spanElem.parentElement.parentElement.parentElement.querySelectorAll(
                            'a',
                          )[0].href,
                          fileName:
                            spanElem.parentElement.parentElement.parentElement.parentElement.previousElementSibling.querySelector(
                              'strong',
                            ).textContent,
                        });
                      }
                    }
                  }
                }

                return arrayToReturn;
              })
              .catch(() => {
                return [];
              }),
            infos: info,
          });

          shortUrlArr = shortUrlArr.filter((elem) => elem.files.length);

          if (shortUrlArr.length == previousLenght) {
            previousLenght = shortUrlArr.length;

            shortUrlArr = shortUrlArr.concat({
              files: await page
                .evaluate(() => {
                  const arrayToReturn = [];

                  for (const element of document.getElementsByClassName(
                    'fusion-column-wrapper',
                  )) {
                    const spanElem =
                      element.children[1].querySelectorAll('span')[1];

                    if (spanElem) {
                      const test =
                        element.children[5].firstChild.firstChild.firstChild;

                      if (test.textContent.includes('Uptobox')) {
                        arrayToReturn.push({
                          link: test.parentElement.querySelectorAll('a')[0]
                            .href,
                          fileName:
                            element.children[1].querySelectorAll('span')[1]
                              .textContent,
                        });
                      }
                    }
                  }

                  return arrayToReturn;
                })
                .catch(() => {
                  return [];
                }),
              infos: info,
            });
          }

          shortUrlArr = shortUrlArr.filter((elem) => elem.files.length);

          if (shortUrlArr.length == previousLenght) {
            previousLenght = shortUrlArr.length;

            shortUrlArr = shortUrlArr.concat({
              files: await page
                .evaluate(() => {
                  const arrayToReturn = [];

                  for (const element of document.getElementsByClassName(
                    'fusion-column-wrapper',
                  )) {
                    element.querySelectorAll('span').forEach(function (item) {
                      if (
                        item.textContent.includes('Uptobox Links') &&
                        !item.firstChild.firstChild
                      ) {
                        const linkArr =
                          item.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.nextSibling.nextSibling.firstChild.parentElement.children[0].children[0].children[1].querySelectorAll(
                            'a',
                          );

                        linkArr.forEach(function (item) {
                          arrayToReturn.push({
                            link: item.href,
                            fileName: item.textContent,
                          });
                        });
                      }
                    });
                  }

                  return arrayToReturn;
                })
                .catch(() => {
                  return [];
                }),
              infos: info,
            });
          }

          shortUrlArr = shortUrlArr.filter((elem) => elem.files.length);

          if (shortUrlArr.length == previousLenght) {
            shortUrlArr = shortUrlArr.concat({
              files: await page
                .evaluate(() => {
                  const arrayToReturn = [];

                  const element = document.getElementsByClassName(
                    'fusion-column-wrapper',
                  )[0];

                  if (element) {
                    for (
                      let index = 1;
                      index < element.children[2].childElementCount;
                      index++
                    ) {
                      arrayToReturn.push({
                        link: element.children[2].children[
                          index
                        ].getElementsByTagName('a')[0].href,
                        fileName:
                          element.children[2].children[index].firstChild
                            .firstChild.textContent,
                      });
                    }
                  }

                  return arrayToReturn;
                })
                .catch(() => {
                  return [];
                }),
              infos: info,
            });
          }

          this.websocketService.emit(
            'searchProgressDataEvent',
            (shortUrlArr = shortUrlArr.filter((elem) => elem.files.length)),
          );
        }
      } else {
        this.searchProgress = 'no movie found';
        this.websocketService.emit('searchProgressEvent', this.searchProgress);
      }

      browser.close();
    }

    this.searchProgress = '';
    this.websocketService.emit('searchProgressEvent', this.searchProgress);

    this.searchEngaged = false;

    return;
  }

  async getPremiumLink(link: string) {
    const onError = (err) => {
      console.log(err);

      this.websocketService.emit('mediaLinkDataEvent', {
        msg: 'Fatal error',
        link: null,
        timeOut: null,
      });
    };

    this.inDownloadResolver = true;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setRequestInterception(true);

    page.on('request', (request) => {
      if (
        request.url().includes('adpopblocker') ||
        request.url().includes('adsco') ||
        request.url().includes('lilacdefencelessroyal') ||
        request.url().includes('multiadblock') ||
        request.url().includes('mignished-sility') ||
        request.url().includes('watch')
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });

    this.websocketService.emit('mediaLinkDataEvent', {
      msg: 'redirect to download',
      link: null,
      timeOut: null,
    });

    await page.goto(link);

    this.websocketService.emit('mediaLinkDataEvent', {
      msg: 'resolving captcha ',
      link: null,
      timeOut: 500,
    });

    await page.waitForTimeout(5000);

    this.websocketService.emit('mediaLinkDataEvent', {
      msg: 'getting media premium link',
      link: null,
      timeOut: null,
    });

    let mediaLink: any = await page.evaluate(() => {
      return document
        .getElementsByClassName('get-link')[0]
        .getAttribute('href');
    });

    mediaLink = {
      uptoLink: mediaLink,
      premiumLink: await up.getLink(mediaLink).catch((err) => {
        onError(err);
      }),
    };

    const linkInfo = await up
      .getLinkInfo(mediaLink.uptoLink.split('?')[0])
      .catch((err) => {
        onError(err);
      });

    mediaLink = {
      downloadLink: mediaLink.premiumLink,
      filename: linkInfo ? linkInfo.name : mediaLink.premiumLink,
      size: linkInfo ? linkInfo.size : 'NO-DATA',
      utptostreamLink: linkInfo ? linkInfo.utptostreamLink : undefined,
    };

    this.websocketService.emit('mediaLinkDataEvent', {
      msg: null,
      link: mediaLink,
      timeOut: null,
    });

    this.inDownloadResolver = false;
  }
}
