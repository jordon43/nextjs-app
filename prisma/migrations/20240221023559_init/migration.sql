-- CreateTable
CREATE TABLE "InfoButton" (
    "id" SERIAL NOT NULL,
    "textButton" TEXT NOT NULL,
    "textLinkButton" TEXT,
    "displayMode" TEXT NOT NULL,
    "typeKeyboard" TEXT NOT NULL,
    "idCommunicationType" INTEGER NOT NULL,

    CONSTRAINT "InfoButton_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunicationType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "maxCharCount" INTEGER,
    "maxButtonsCount" INTEGER,
    "maxButtonTextLength" INTEGER,
    "supportLinkButtons" INTEGER,
    "inlineMaxButtonsCount" INTEGER,
    "inlineMaxButtonTextLength" INTEGER,
    "inlineSupportLinkButtons" INTEGER,

    CONSTRAINT "CommunicationType_pkey" PRIMARY KEY ("id")
);


INSERT INTO "CommunicationType" ("id", "name", "maxCharCount", "maxButtonsCount", "maxButtonTextLength", "supportLinkButtons", "inlineMaxButtonsCount", "inlineMaxButtonTextLength", "inlineSupportLinkButtons")
  VALUES
    (0, 'ВКонтакте', 4096, 40, NULL, -1, 10, NULL, -1),
    (1, 'WhatsApp', 1000, 10, 20, 0, 3, 20, 1),
    (2, 'Telegram', 4096, -1, NULL, 0, -1, 64, 1),
    (3, 'SMS', NULL, NULL, NULL, 0, NULL, NULL, 0);


-- AddForeignKey
ALTER TABLE "InfoButton" ADD CONSTRAINT "InfoButton_idCommunicationType_fkey" FOREIGN KEY ("idCommunicationType") REFERENCES "CommunicationType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
