import {useEffect, useRef, useState} from 'react';
import utils from '../helpers/utils';
import {showDialog} from './Dialog';
import '../less/preview-image-dialog.less';
import React from 'react';
import appStore from '../stores/appStore';
import close from '../icons/close.svg';
import {Notice} from 'obsidian';

interface Props extends DialogProps {
  imgUrl: string;
  filepath?: string;
}

const PreviewImageDialog: React.FC<Props> = ({destroy, imgUrl, filepath}: Props) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgWidth, setImgWidth] = useState<number>(-1);
  const {vault} = appStore.getState().dailyNotesState.app;

  useEffect(() => {
    utils.getImageSize(imgUrl).then(({width}) => {
      if (width !== 0) {
        setImgWidth(80);
      } else {
        setImgWidth(0);
      }
    });
  }, []);

  const handleCloseBtnClick = () => {
    destroy();
  };

  const handleDecreaseImageSize = () => {
    if (imgWidth > 30) {
      setImgWidth(imgWidth - 10);
    }
  };

  const handleIncreaseImageSize = () => {
    setImgWidth(imgWidth + 10);
  };

  const convertBase64ToBlob = (base64: string, type: string) => {
    var bytes = window.atob(base64);
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], {type: type});
  };

  const copyImageToClipboard = async () => {
    if ((filepath === null || filepath === undefined) && imgUrl !== null) {
      const myBase64 = imgUrl.split('base64,')[1];
      const blobInput = convertBase64ToBlob(myBase64, 'image/png');
      const clipboardItemInput = new ClipboardItem({'image/png': blobInput});
      // @ts-ignore
      window.navigator['clipboard'].write([clipboardItemInput]);
      new Notice('Send to clipboard successfully');
    } else {
      var buffer = await vault.adapter.readBinary(filepath);
      var arr = new Uint8Array(buffer);

      var blob = new Blob([arr], {type: 'image/png'});
      // @ts-ignore
      const item = new ClipboardItem({'image/png': blob});
      // @ts-ignore
      window.navigator['clipboard'].write([item]);
    }
  };

  return (
    <>
      <button className="btn close-btn" onClick={handleCloseBtnClick}>
        <img className="icon-img" src={close} />
      </button>

      <div className="img-container internal-embed image-embed is-loaded" >
        <img className={imgWidth <= 0 ? 'hidden' : ''} ref={imgRef} width={imgWidth + '%'} src={imgUrl} />
        <span className={'loading-text ' + (imgWidth === -1 ? '' : 'hidden')}>图片加载中...</span>
        <span className={'loading-text ' + (imgWidth === 0 ? '' : 'hidden')}>😟 图片加载失败，可能是无效的链接</span>
      </div>

      <div className="action-btns-container">
        <button className="btn" onClick={handleDecreaseImageSize}>
          ➖
        </button>
        <button className="btn" onClick={handleIncreaseImageSize}>
          ➕
        </button>
        <button className="btn" onClick={() => setImgWidth(80)}>
          ⭕
        </button>
        <button className="btn" onClick={copyImageToClipboard}>
          📄
        </button>
      </div>
    </>
  );
};

export default function showPreviewImageDialog(imgUrl: string, filepath?: string): void {
  if (filepath) {
    showDialog(
      {
        className: 'preview-image-dialog',
      },
      PreviewImageDialog,
      {imgUrl, filepath},
    );
  } else {
    showDialog(
      {
        className: 'preview-image-dialog',
      },
      PreviewImageDialog,
      {imgUrl},
    );
  }

  // setTimeout(() => {
  //   document.querySelector(".preview-image-dialog").addEventListener("keypress", closeWindowByEsc);
  // }, 0);
}

// function closeWindow() {
//   document.querySelector(".preview-image-dialog .close-btn").click();
// }

// function closeWindowByEsc(e) {
//   if (!e) e = window.event;
//   var keyCode = e.keyCode || e.which;
//   if (keyCode == '27') {
//     closeWindow();
//   }
// }
