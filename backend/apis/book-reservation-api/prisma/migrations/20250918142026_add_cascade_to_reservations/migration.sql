-- DropForeignKey
ALTER TABLE "public"."Reservation" DROP CONSTRAINT "Reservation_book_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."Reservation" ADD CONSTRAINT "Reservation_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
