function getFile(url) {
  return new Promise((resolve, reject) => {

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();
    
    xhr.onload = () => {
      resolve(xhr.responseText);
    };

    xhr.onerror = () => {
      reject(xhr.statusText);
    };
  });
}

export {getFile};