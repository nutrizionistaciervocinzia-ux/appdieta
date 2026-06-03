/* eslint-disable */
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
console.log("GlobalWorkerOptions:", GlobalWorkerOptions);
console.log("workerSrc initial:", GlobalWorkerOptions.workerSrc);
GlobalWorkerOptions.workerSrc = "dummy_src";
console.log("workerSrc after set:", GlobalWorkerOptions.workerSrc);
