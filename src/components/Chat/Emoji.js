import React, { useState } from 'react'
import { ClickAwayListener, IconButton } from "@material-ui/core";
import { Picker } from "emoji-mart";
import EmojiEmotions from "@material-ui/icons/EmojiEmotions";
import "emoji-mart/css/emoji-mart.css";



export const Emoji = ({ addEmoji }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

    
  return (
    <>
        <ClickAwayListener onClickAway={() => setShowEmojiPicker(false)}>
            <IconButton>
              <EmojiEmotions
                onClick={handleEmojiPickerhideShow}
                color="primary"
              />
              {showEmojiPicker && (
                <Picker
                  title="Tap Chat"
                  showPreview={false}
                  showSkinTones={false}
                  className="emojiStyle"
                  onSelect={addEmoji}
                  style={{
                    position: "absolute",
                    top: "-400px",
                    right: "-20px",
                    backgroundColor: "#363a3f",
                    // boxShadow: "0 5px 10px #9a86f3",
                    borderColor: "#9a86f3",
                  }}
                />
              )}
            </IconButton>
          </ClickAwayListener>
    </>
  )
}
