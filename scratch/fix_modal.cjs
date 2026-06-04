const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/PatientView.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add createPortal import
if (!content.includes("import { createPortal } from 'react-dom';")) {
  content = content.replace("import React, { useState, useEffect, useRef } from 'react';", "import React, { useState, useEffect, useRef } from 'react';\nimport { createPortal } from 'react-dom';");
}

// 2. Wrap modal in createPortal
const modalStart = "return (";
const modalBlockStartIdx = content.indexOf('return (', content.indexOf("const isActiveDayCompleted = completedDaysArr[selectedChallengeDay];"));

if (modalBlockStartIdx !== -1) {
  // Find the exact return block
  const searchStr = `
                    return (
                      <div style={{
                        position: 'fixed',`;
  
  if (content.includes("animation: 'fadeIn 0.3s ease'")) {
    content = content.replace(/return \(\s*<div style={{\s*position: 'fixed',/g, "return createPortal(\n                      <div style={{\n                        position: 'fixed',");
    
    // Now find the end of that IIFE return and add `, document.body)`
    const endStr = `                      </div>\n                    );\n                  })()}`;
    content = content.replace(endStr, `                      </div>,\n                      document.body\n                    );\n                  })()}`);
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Modal fixed with createPortal");
