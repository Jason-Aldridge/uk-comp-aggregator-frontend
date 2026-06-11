export default function Page({ params }: { params: { id: string } }) {
  return <main>Competition {params.id}</main>;
}